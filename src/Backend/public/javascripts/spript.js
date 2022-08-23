
const form = document.getElementById("formdata");


function ClearFields() {
    document.getElementById("productName").value = "";
    document.getElementById("details").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("updateFile").value = "";
    document.getElementById("size").selectedIndex = 0
    document.getElementById("catalog").selectedIndex = 0
    document.getElementById("color").value = "#0000000"

}
function PostForm() {
    const form = document.forms.formdata;
    const formData = new FormData(form);
    console.log(formData.get("color"));
    axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.post('/api/1.0/products/create', formData)
        .then(function (response) {
            if (response.data.msg == 'success'){
                alert(`Success update product id: ${response.data.id}`)
                location.reload();
            }
            else
                console.log(response)
        })
        .catch(function (error) {
            console.log(error);
        });
    
    

}
function AddSpec() {
    
    const componts = 
        `<div class="spec" id="spec">
            <p>Color :</p>
            <input id="color" name="color" type="color" required />
            <p>Size : </p>
            <select id="size" name="size">
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
            </select>
            <p>Amount : </p> 
            <input id="amount" name="amount" type="number" min="0" required
                oninput="value=value.replace(/[^\\d]/g,'')" />
            <button id='add'type="button" onclick="AddSpec()" >add </button>
        </div> `;
    let spec = document.getElementById("spec")
    spec.id= "";
    spec.insertAdjacentHTML('afterend',componts);
    document.getElementById("add").remove();
}
form.addEventListener('submit', (event) => {
    // handle the form data
    event.preventDefault();
    PostForm()
});

