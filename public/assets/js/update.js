let inputToggle = () => {
    let input1 = document.getElementById('input1')
    let input2 = document.getElementById('input2')
    let inputsearch = document.getElementById('inputsearch')
    input1.style.display = "none"
    input2.style.display = "block"

    inputsearch.focus()
}
let disappearSearch = () => {
    let input1 = document.getElementById('input1')
    let input2 = document.getElementById('input2')
    input1.style.display = "block"
    input2.style.display = "none"

}
window.onclick = function (event) {
    let input1 = document.getElementById('input1')
    let inputbefore = document.getElementById('inputbefore')
    let mainbody = document.getElementById('mainbody')
    let input2 = document.getElementById('input2')
    let searchdocs = document.getElementById('searchDocs')
    let inputsearch = document.getElementById('inputsearch')


    if (event.target == searchdocs) {
        input1.style.display = "none"
        input2.style.display = "block"

    }
    else if (event.target == inputsearch) {
        input1.style.display = "none"
        input2.style.display = "block"

    }
    else {

        input1.style.display = "inherit"
        input2.style.display = "none"
    }


} 
