//get access to nav ul to add li later
const navContainer= document.querySelector(".categories");
//to get integrated from server later  
const categories=["أجزاء خارجية", "أجزاء الماتور","خراطيم","بنزين","رمان بلي","عفشة وفرامل","اسبراي وملمع"]
//create fragment to improve Reflow time consuming
let liFragment=document.createDocumentFragment();
//search input
const search=document.querySelector("#search");
// dummi array as input compeletion 
const arr=[...categories,"سيارات","زيت","ماتور","معطر","زجاج","اجزاء داخلية"];

const autocomplete=document.querySelector(".autocomplete");

const ul=document.createElement("ul");
ul.setAttribute("class","search-options");
let fragment=document.createDocumentFragment();
let found=false;
/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

//Navigation stage: initialize links of the nav bar 
function initNavLinks (){
    //1. loop the sections and create li & <a> accordingly
    for(const category of categories){
        //2. create li elements
        const li=document.createElement("li");
        //3.create a element
        const a=document.createElement("a");
        //4. set the name of the link
        a.textContent=category;
        //console.log(a.textContent);      //test
        //5. add a to li
        li.appendChild(a);
        //6. add li to fragment
        liFragment.appendChild(li);
        //7. add li style class
        addLinkClassStyles(li);
    }
    //8. add fragment to navContainer ul (that decreases Reflow)
    navContainer.appendChild(liFragment);
}
//Navigation stage: add class style to links in the nav bar (li and href link to <a>)
function addLinkClassStyles(li){
    li.classList.add("category");
    li.firstChild.setAttribute("href",`#`);  //to add links here later
}

//normalize arabic text
 function normalizeText(text) {

    //remove special characters
    text = text.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '');
  
    //normalize Arabic
    text = text.replace(/(آ|إ|أ)/g, 'ا');
    text = text.replace(/(ة)/g, 'ه');
    text = text.replace(/(ئ|ؤ)/g, 'ء')
    text = text.replace(/(ى)/g, 'ي');
  
    //convert arabic numerals to english counterparts.
    var starter = 0x660;
    for (var i = 0; i < 10; i++) {
      text.replace(String.fromCharCode(starter + i), String.fromCharCode(48 + i));
    }
  
    return text;
  }

//auto complete 
function autocompleteFn() {
    console.log("inside autocomplete______________")
    let arr2=[];
    search.addEventListener("input",(e)=>{
        //console.log(e.target.value);
        // var a, b, i, val = this.value;
        // console.log("a= ",a,"b= ",b,"i= ",i,"val= ",val);
        const input =normalizeText(e.target.value);
        console.log(input);
        if(input !== ""){
            arr2 = arr.filter((element)=>normalizeText(element).includes(input));
            console.log("arr2= ",arr2);
            makeDropdownList(arr2,input) 
        }
        else{
            console.log("inside else")
            //arr2=[]
            resetList()
        }
        
    })
}
function makeDropdownList(arr2,input){
    console.log("inside dropdown________________")
    // sort array according to start string (most match)
    arr2.sort((a,b)=>{
        if(a.startsWith(input) && !(b.startsWith(input ))){
            return -1;
        }
        else if(!(a.startsWith(input)) && b.startsWith(input )) {
            return 1;
        }
        else {
            return 0;
        }
    })
    console.log("sorted= ",arr2);

    //create the dropdown list
    //reset dropdownlist
    resetList()
    //create newlist
    for(const option of arr2){
        console.log("option= ",option)
        const li=document.createElement("li");
        li.innerHTML=option;
        fragment.appendChild(li);
        //7. add li style class
        li.setAttribute("class","option");
    }
    ul.appendChild(fragment);
    autocomplete.appendChild(ul);
    keyUpandDown();
}

//reset dropdownlist after each input
function resetList(){
    console.log("inside reset_____________")
    try{
        let list=document.querySelector(".search-options")
        console.log("li= ",list)
        while (list.firstChild) {
            console.log("list.lastChild",list.lastChild)
            list.removeChild(list.lastChild);
          }     
    }catch(error){
        console.log("error=",error)
    }
    
}
function keyUpandDown(){
    console.log("inside keyUpandDown________");
    const lists=document.getElementsByClassName("option")
    
    search.addEventListener("keydown",(e)=>{
        //e.preventDefault();
        e.stopImmediatePropagation()
        //key down pressed
        console.log("key pressed")
        found=false;
        let next;
        if (e.keyCode == 40){
            //e.preventDefault();
            for(let i=0;i<lists.length;i++){
                console.log("found= ",found)
                if(lists[i].classList.contains('current-focus')&& !found){
                    next=(i+1)%(lists.length);
                    console.log("lists.length",lists.length,"next=",next);
                    lists[i].classList.remove('current-focus');
                    console.log("i+1= ",next,"current class= ", lists[next])
                    lists[next].classList.add('current-focus');
                    search.value=lists[next].textContent;
                    found=true;
                    break;
                }
            }
            if(!found&& lists.length>0){
                console.log("i0= ","current class= ", lists[0])
                lists[0].classList.add('current-focus');
            }
        }
        
    })
}
initNavLinks();
autocompleteFn();
