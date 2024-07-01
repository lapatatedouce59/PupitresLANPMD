let gtg = false
let ws = false

let get = (id)=>{
    return document.getElementById(id)
}

get("ws-con").addEventListener('click',async ()=>{
    if(typeof get("ws-ip").value === 'string'){
        ws = new WebSocket(`ws://${get("ws-ip").value}:8081`)
        get("ws-con").disabled=true
        ws.addEventListener('error',()=>{
            console.error('CONNEXION AU WS IMPOSSIBLE')
            lostCon()
        })
        ws.addEventListener('close',()=>{
            console.error('CONNEXION AU WS INTEROMPUE')
            lostCon()
        })
        ws.addEventListener('open',()=>{
            console.log("CONNECTÉ AU WS")
            ws.send(JSON.stringify({
                op: 1,
                entity: "MOBI"
            }))
            ws.addEventListener('message',msg=>{
                msg=JSON.parse(msg.data)
                console.log(msg)
                if(msg.op===2){
                    gtg=msg.good
                    if(gtg===true) console.log("LIAISON SUCCESS"); else console.log("LIAISON INTEROMPUE");
                }
                if(msg.op===3){
                    get("simu-speed").innerText=`${msg.value}`
                }
            })
        })
    }
    
})

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function lostCon(){
    ws=false
    gtg=false
    get("ws-con").disabled=false
    get("simu-speed").innerText=`X `
}