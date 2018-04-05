var fetchBox = document.getElementById('search-field');
var fetchBtn = document.getElementById('fetchBtn');

fetchBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    document.getElementById("progress-area").innerHTML = fetchBox.value;
    return false;   
})