const grid = {
    colMax:                 4,                                  //sets grid columns
    rowMax:                 4,                                  //sets grid rows
    wheelLimit:             3,                                  //sets the mousewheel limit
    wheelCounter:           0,          
    opacity:                0.3,                               //grid opacity
    bgColor:                `rgb(0,0,255)`,                     //for grid
    mode:                   "bg",                               //bg = changes bg color, text = displays items in array
    itemBgColor:            `white`,                            // for items
    itemList:               [],
    displayItemList:        [
        ..."abcdefghijklmnopqrstuvwxyz",
    ]   
};

//fn gen random speed
const setRandomSpeed =()=>{
    let spd = (Math.floor(Math.random() * 10) / 100) + 0.2;
    spd = spd < 0.01 ? 0.1 : spd;
    return spd;
};

//fn get random display item
const getRandomDisplayItem=()=>{
    return `${grid.displayItemList[Math.floor(Math.random() * grid.displayItemList.length )]}`.toUpperCase();
};

grid.itemTotal = (grid.colMax * grid.rowMax); //sets total items

//inject bgMain element
const bgMain = document.createElement("div");
bgMain.classList.add("bl-bg");
const bgGrid = document.createElement("div");
bgGrid.classList.add("bl-bg-grid");

//inline style for bgMain div based off grid column and row maxs and set opacity
bgMain.style = `background-color: ${grid.bgColor};`;
bgGrid.style = `
    grid-template-columns: repeat(${grid.colMax}, 1fr);
    grid-template-rows: repeat(${grid.rowMax}, 1fr);
    opacity: ${grid.opacity};
`;

//create divs based off grid total items
for(let i = 0; i < grid.itemTotal; i++){
    const id = `bl-bg-grid-${i}`;
    let randomNum = Math.floor(Math.random() * grid.wheelLimit);
    randomNum = randomNum <=0 ? 1 : randomNum;
    const randomOpacity = Math.floor(Math.random() * 10) / 10;

    const setMode = grid.mode == "bg" ? `style="background-color:${grid.itemBgColor}; width: 50%;
    padding-bottom: 50%;"` : '';

    bgGrid.innerHTML += `<div id="${id}" style="opacity: ${randomOpacity}; " class="bl-bg-item">
        <div ${setMode}>${grid.mode == "text" ? getRandomDisplayItem() : ''}</div>
    </div>`;
    
    grid.itemList.push({id: id, seed: randomNum, opacity: randomOpacity, speed: setRandomSpeed(), peaked: false});
}

//inject css
const linkStyle = document.createElement("link");
linkStyle.rel  = 'stylesheet';
linkStyle.type = 'text/css';
linkStyle.href = "./assets/bl-bg.css";

//append css and grid div
window.addEventListener("load", ()=>{
    document.head.append(linkStyle);
    document.body.append(bgMain);
    document.body.append(bgGrid);
    console.log(grid);
});

document.addEventListener('wheel', (e) => {
    const direction = Math.sign(e.deltaY)
    grid.wheelCounter += direction;
    if(grid.wheelCounter > grid.wheelLimit){
        grid.wheelCounter = 1;
    }else if(grid.wheelCounter < 1){
        grid.wheelCounter = grid.wheelLimit;
    }

    grid.itemList.forEach(item => {
        const el = document.querySelector(`div#${item.id}`);

        if(item.seed === grid.wheelCounter){
            item.opacity = item.peaked ? item.opacity - item.speed : item.opacity + item.speed;

            if(item.opacity >= 1){
                item.peaked = true;
            }

            if(item.opacity <= 0 && item.peaked){
                item.opacity = 0;
                item.speed = setRandomSpeed();
                item.peaked = false;
                if(grid.mode == "text"){
                    el.children[0].innerHTML = getRandomDisplayItem();
                }
            }

            el.style.opacity = item.opacity;
        }
    });
});





