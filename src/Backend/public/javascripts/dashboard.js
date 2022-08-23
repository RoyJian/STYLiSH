
function Dashboard(data) {
    this.data = data;

    this.onlineUserCount = function() {
        const dom = document.getElementById('number');
        dom.innerHTML = 'Total Revenue: ' + data.totalRevenue;
    };

    this.drawProductsDivideByColor = function() {
        let colorData = [{
            values: data.productsDivideByColor.map(x => x.count),
            labels: data.productsDivideByColor.map(x => x.colorName),
            marker: {
                colors: data.productsDivideByColor.map(x => x.colorCode)
            },
            type: 'pie'
        }];
        var layout = {
            title: {
                text:'Product sold percentage in different colors',
            },
            height: 350,
        };
        Plotly.newPlot('pie', colorData, layout);
    };

    this.drawProductsInPriceRange = function() {
        var trace = {
            x: this.data.productsInPriceRange,
            type: 'histogram',
        };
        var layout = {
            title: {
                text:'Product sold quantity in different price range',
            },
            xaxis: {
                title: {
                    text: 'Price Range',
                },
            },
            yaxis: {
                title: {
                    text: 'Quantity',
                }
            }
        };
        var data = [trace];
        Plotly.newPlot('histogram', data, layout);
    };

    this.drawTop5ProductsDividedBySize = function() {
        var sizeData = this.data.top5ProductsDividedBySize.map(d => ({
            x: d.ids.map(id => 'product ' + id),
            y: d.count,
            name: d.size,
            type: 'bar'
        }));

        var layout = {
            barmode: 'stack',
            title: {
                text:'Quantity of top 5 sold products in different sizes',
            },
            yaxis: {
                title: {
                    text: 'Quantity',
                }
            }
        };
        Plotly.newPlot('bar', sizeData, layout);
    };
    
}
async function  ProcessData(){
    const data = (await axios.get('/api/1.0/orders/data')).data;
    const subRevenue = data.map((order)=> parseInt(order.total));
    const Revenue = subRevenue.reduce((previousValue,currentValue)=>previousValue + currentValue,0);
    let Getlist = ()=>{
      const array = [];
      data.map((orders)=> {
          orders.list.map((item)=>{
            array.push(item);
          })
      });
      return array;
    }
    const list= Getlist();
    let productsDivideByColor = list.reduce((obj,item)=>{
        if(item.color.code in obj){
            obj[item.color.code] += item.qty;
        }   
        else {
            obj[item.color.code] = item.qty;
        }
        return obj
    },{});
    const colorSet = [];
    Object.keys(productsDivideByColor).map((key)=>{
        colorSet.push( {
            colorCode:key,
            count:productsDivideByColor[key],
            colorName:key
        })
    })
    const GetproductsInPriceRange = ()=>{
        const array = [];
        list.map((item)=>{
            for (let i = 0;i<item.qty;i++)
                array.push(item.price);
        })
        return array;
    }
    const Gettop5ProductsDividedBySize = ()=>{
        const array = [];
        const sizeSet = ['S','M','L'];

        let countByid = list.reduce((obj,item)=>{
            if(item.id in obj){
                obj[item.id] += item.qty;
            }   
            else {
                obj[item.id] = item.qty;
            }
            return obj
        },{});

        let ids = Object.keys(countByid).map((key)=>{
            return ( {
                id:parseInt(key) ,
                count:countByid[key]
            })
        })
        
        // console.log(ids)
        ids.sort((a,b)=> {return b.count-a.count});
        ids = ids.map((id,index)=>{
            if(index<5)
                return parseInt(id.id) 
        }).slice(0,5);
        console.log(ids)
        const iddd = ids;
        const top = list.filter(el=> ids.indexOf(el.id)!== -1)
        console.log('ddd',top);
        sizeSet.forEach(size => {
            listBySize = top.filter((element)=>{
                return element.size === size;
            });
            const idBySizeandFive = Array.from(new Set (listBySize.map((item)=> item.id))).sort((a, b) => ids.indexOf(a) - ids.indexOf(b));
            const count = []
            idBySizeandFive.map((id)=>{
                const subcount= listBySize.reduce((obj,item)=>{
                    if(item.id === id )
                        return obj += item.qty;
                    else 
                        return obj;
                },0)
                count.push(subcount);
            }) 
            array.push({
                ids:idBySizeandFive,
                count:count,
                size:size
            })

        });
        console.log(array);

        return array;        
    }
    //console.log(Gettop5ProductsDividedBySize());

    return {
        totalRevenue: Revenue,
        productsDivideByColor:colorSet,
        productsInPriceRange:GetproductsInPriceRange(),
        top5ProductsDividedBySize:Gettop5ProductsDividedBySize()
    }
    
    
    
};
function main() {
    ProcessData().then((data)=>{
        Dashboard = new Dashboard(data);
        Dashboard.onlineUserCount();
        Dashboard.drawProductsDivideByColor();
        Dashboard.drawProductsInPriceRange();
        Dashboard.drawTop5ProductsDividedBySize();
    });

}
main();