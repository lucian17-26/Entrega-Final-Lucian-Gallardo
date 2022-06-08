const boton= document.getElementById('switch');

const configUser= window.matchMedia('(prefers-color-scheme: dark)');

let localConfig= localStorage.getItem(`tema`);
if(localConfig === 'dark'){
    document.body.classList.toggle('dark-topic')
} if(localConfig === 'light'){
    document.body.classList.toggle('light-topic')
}

boton.addEventListener('click',() => {
    let colourTopic;
    if(configUser.matches){
        // Entramos con tema establecido en window
        document.body.classList.toggle('light-topic')
        colourTopic= document.body.classList.contains('light-topic') ? 'light' : 'dark'
        
    }else{
        
        document.body.classList.toggle('dark-topic')
        colourTopic= document.body.classList.contains('dark-topic') ? 'dark' : 'ligth'
    }
    localStorage.setItem(`tema`, colourTopic)
});
