let addBtn = document.querySelector('.add-button');
let modalContainer = document.querySelector('.modal')
let mainContainer = document.querySelector('.main-container');
let textArea = document.getElementById('ticket_name');
let removeBtn = document.querySelector('.remove-button');
let allPriorityColors = document.querySelectorAll('.priority-color');
let toolboxColors = document.querySelectorAll('.color');
let h1 = document.querySelector('h1');
// let style = window.setComputedStyle(body, '::before');
colors = ['lightpink', 'lightgreen', 'lightblue', 'black'];
let modalPriorityColor = colors[colors.length - 1];

let ticketArr = [];

if(localStorage.getItem("jira_ticket")){
    ticketArr = JSON.parse(localStorage.getItem("jira_ticket"));
    ticketArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId);
    })
}

let root = document.querySelector(':root');
function set_property(){
    setTimeout(() => {
        root.style.setProperty('--position', 'fixed');
        root.style.setProperty('--ticketPosition', 'relative');
        root.style.setProperty('--opacity', '1');
    }, 100);
    root.style.setProperty('--beforeLeft', '0%');
    root.style.setProperty('--afterLeft', '0%');
}
set_property();




for(let i = 0;i < toolboxColors.length; i++) {
    toolboxColors[i].addEventListener('click', (e) => {
        let filtredTicketArr = ticketArr.filter((ticketObj) => {
            return toolboxColors[i].classList[0] === ticketObj.ticketColor;
        });
        let allTicketContainer = document.querySelectorAll('.ticket-container');
        allTicketContainer.forEach((ticket) => {
            ticket.remove();
        })
        filtredTicketArr.forEach((ticketObj) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId);
        })
    })
    toolboxColors[i].addEventListener('dblclick', (e) => {
        let allTicketContainer = document.querySelectorAll('.ticket-container');
        allTicketContainer.forEach((ticket) => {
            ticket.remove();
            console.log('remove');
        })
        ticketArr.forEach((ticketObj) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId);
        })
    })
}

// Set Border to the selected priority color
allPriorityColors.forEach((colorsEle, idx) => {
    colorsEle.addEventListener('click', (e) => {
        allPriorityColors.forEach((priorityColorsEle, idx) => {
            if(priorityColorsEle.classList.contains('border')){
                priorityColorsEle.classList.remove('border');
            }
        })
        colorsEle.classList.add('border');
        modalPriorityColor = colorsEle.classList[0];
    })
})


// Toggle active class on remove button
removeBtn.addEventListener('click', (e) => {
    removeBtn.classList.toggle('active');
})

// Display Modal
addBtn.addEventListener('click', (e)=>{
    if(addBtn.classList.contains('active')){
        modalContainer.style.display = 'none';
        addBtn.classList.remove('active');

        
        // console.log("none");
    }
    else{
        addBtn.classList.add('active');
        modalContainer.style.display = 'flex';
        // console.log('flex');
    }
})

// generate ticket
modalContainer.addEventListener("keydown", (e) => {
    let key = e.key;
    if(key === 'Shift'){
        createTicket(modalPriorityColor ,textArea.value);
        setModalDefault();
    }
})

function createTicket(ticketColor, ticketTask, ticketId){
    let id = ticketId || shortid();
    let ticketContainer = document.createElement('div');
    ticketContainer.setAttribute('class', 'ticket-container');
    console.log(ticketColor, id, ticketTask);
    ticketContainer.innerHTML = `
            <div class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">${id}</div>
            <div class="task-area" spellcheck="false">
                ${ticketTask}
            </div>
            <div class="locks">
                <div class="lock material-icons">lock</div>
            </div>
    `
    if(!ticketId) {
        ticketArr.push({ticketColor, ticketId: id, ticketTask});
        localStorage.setItem("jira_ticket", JSON.stringify(ticketArr));
}
    mainContainer.appendChild(ticketContainer);
    handleRemoval(ticketContainer, id);
    handleLock(ticketContainer, id);
    handleTicketColors(ticketContainer,id);
    
}

function handleRemoval(ticketContainer, id){
    let ticketIdx = getTicketIndex(id);
    ticketContainer.addEventListener('click', (e) =>{
        if(removeBtn.classList.contains('active')){
            // console.log('active');
            ticketContainer.remove();
            ticketArr.splice(ticketIdx, 1);
            localStorage.setItem("jira_ticket", JSON.stringify(ticketArr))
        }
    })

}

function handleLock(ticket, id){
    let ticketLock = ticket.querySelector('.lock');
    let taskArea = ticket.querySelector('.task-area');
    ticketLock.addEventListener('click', (e) => {
        let ticketIdx = getTicketIndex(id);
        if(ticketLock.innerText === 'lock_open'){
            taskArea.setAttribute('contenteditable', 'false');
            ticketLock.innerText = 'lock';
        }
        else{
            ticketLock.innerText = 'lock_open';
            taskArea.setAttribute('contenteditable', 'true');
        }
        ticketArr[ticketIdx].ticketTask = taskArea.innerText;
        localStorage.setItem("jira_ticket", JSON.stringify(ticketArr));
    })
}

function handleTicketColors(ticketContainer, id){
    let ticketColor = ticketContainer.querySelector('.ticket-color');
    let ticketIdx = getTicketIndex(id);
    ticketColor.addEventListener('click', (e) => {
        let currTicketColor = ticketColor.classList[1];
        let currTicketColorIdx = colors.findIndex((color) => {
            return color === currTicketColor;
        })
        currTicketColorIdx++;
        let newTicketColorIdx = currTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currTicketColor);
        ticketColor.classList.add(newTicketColor);
        console.log(ticketIdx)
        ticketArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("jira_ticket", JSON.stringify(ticketArr));
    })

    // This code written by me. it display all ticket container whose color is same as selected color.
    /*
    let ticketColors = mainContainer.querySelectorAll('.ticket-container');
    toolboxColors.forEach((colorsEle, idx) => {
        colorsEle.addEventListener('click', (e) => {
            let seletedColor = colorsEle.classList[0];
            ticketColors.forEach((ticketColorsEle, idx) => {
                if(!ticketColorsEle.children[0].classList.contains(seletedColor)){
                    ticketColorsEle.style.display = 'none';
                }
                else{
                    ticketColorsEle.style.display = 'block';
                }
            })
        })
    })
    */
}

function getTicketIndex(id){
    console.log(id)
    let ticketIdx = ticketArr.findIndex((ticketObj) => {
        return id === ticketObj.ticketId;
    })
    return ticketIdx;
}

function setModalDefault(){

    modalContainer.style.display = 'none';
    addBtn.classList.remove('active');
    textArea.value = '';
    allPriorityColors.forEach((priorityColorsEle, idx) => {
        if(priorityColorsEle.classList.contains('border')){
            priorityColorsEle.classList.remove('border');
        }
    })
    modalPriorityColor = colors[allPriorityColors.length - 1];
    allPriorityColors[allPriorityColors.length - 1].classList.add('border');
}