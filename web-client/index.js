let get = (id)=>{
    return document.getElementById(id)
}

let ws = false
let gtg = false


setInterval(()=>{
    if(gtg===true){
        ws.send(JSON.stringify({
            op: 3,
            value: get('vitesse-user').value
        }))
    }
},250)


get('vitesse-user').addEventListener('input',()=>{
    get('current-speed').innerText=`${get('vitesse-user').value} km/h`
})

get("button_connect").addEventListener('click',async ()=>{
    if(true){
        ws = new WebSocket('ws://localhost:8081')
        get("button_connect").disabled=true
        ws.addEventListener('error',()=>{
            console.error('CONNEXION AU WS IMPOSSIBLE')
            ws=false
            gtg=false
            get("button_connect").disabled=false
        })
        ws.addEventListener('close',()=>{
            console.error('CONNEXION AU WS INTEROMPUE')
            ws=false
            gtg=false
            get("button_connect").disabled=false
        })
        ws.addEventListener('open',()=>{
            console.log("CONNECTÉ AU WS")
            ws.send(JSON.stringify({
                op: 1,
                entity: "DASH"
            }))
            ws.addEventListener('message',msg=>{
                msg=JSON.parse(msg.data)
                console.log(msg)
                if(msg.op===2){
                    gtg=msg.good
                    if(gtg===true) console.log("LIAISON SUCCESS"); else console.log("LIAISON INTEROMPUE");
                }
            })
        })
    }
    
})