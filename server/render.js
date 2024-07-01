const func = async () => {
    const response = await window.server_info.localip()
    for(let keys of Object.entries(response)){
        console.log(keys)
        document.getElementById('local_ip').innerText=`${keys[0]}: ${keys[1][0]}`
    }
}
func()

setInterval(()=>{
    (async () => {
        const res = await window.server_info.status()
        if(res.WEB===0){
            document.getElementById('status_liaison_sim').classList.remove('status-ok')
            document.getElementById('status_liaison_sim').classList.add('status-default')
        } else {
            document.getElementById('status_liaison_sim').classList.add('status-ok')
            document.getElementById('status_liaison_sim').classList.remove('status-default')
        }
        if(res.MOB===0){
            document.getElementById('status_liaison_mob').classList.remove('status-ok')
            document.getElementById('status_liaison_mob').classList.add('status-default')
        } else {
            document.getElementById('status_liaison_mob').classList.add('status-ok')
            document.getElementById('status_liaison_mob').classList.remove('status-default')
        }
        if(res.CON===0){
            document.getElementById('status_liaison_com').classList.remove('status-ok')
            document.getElementById('status_liaison_com').classList.add('status-default')
        } else {
            document.getElementById('status_liaison_com').classList.add('status-ok')
            document.getElementById('status_liaison_com').classList.remove('status-default')
        }
    })();
},100)