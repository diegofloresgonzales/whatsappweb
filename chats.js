$(document).ready( async () => {
    let chats = await getChats()

    let html = ''
    for(let c of chats) {
        let div = `<div class="sidebar-chat" onclick="getMessagesByContact('${c.id._serialized}', '${c.id.user}')" id="${c.id.user}" 
                      data-picture="${c.picture || 'https://app.smiledu.com/assets/images/user/unknown-user.png' }"
                      data-name="${c.name}">
                        <div class="chat-avatar">
                            <img src="${c.picture || 'https://app.smiledu.com/assets/images/user/unknown-user.png' }">
                        </div>
                        <div class="chat-info">
                            <h4>${c.name}</h4>
                            <p>Ultimo mensaje</p>
                        </div>
                        <div class="time">
                            <p>2:44 pm</p>
                        </div>
                    </div>`
        html += div
    }

    $("#sidebarchats").html(html)
});

var previousObj = null
async function getMessagesByContact(conctactId, userId) {
    $(`#${userId}`).css('background-color', '#EBEBEB')
    if(previousObj) {
        $(`#${previousObj}`).removeAttr('style')
    }
    previousObj = userId
    /////
    let name = $(`#${userId}`).data('name')
    let pict = $(`#${userId}`).data('picture')
    /////
    let newHtml = `<div class="header">
                        <div class="chat-title">
                            <div class="avatar">
                                <img src="${pict}" alt="">
                            </div>
                            <div class="message-header-content">
                                <h4>${name}</h4>
                                <p></p>
                            </div>
                        </div>
                        <div class="chat-header-right">
                        <img src="search-solid.svg" alt="">
                            <img src="more.svg" alt="">
                        </div>
                    </div>
                    <div class="message-content">
                        <div class="lds-ring" id="spinner"><div></div><div></div><div></div><div></div></div>
                    </div>
                    <div class="message-footer">
                        <img src="smile.svg" alt=" ">
                        <img src="paper-clip.svg" alt="">
                        <input type="text" placeholder="Type a message">
                        <img src="microphone.svg" alt="">
                    </div>`
    $('#message-container').html(newHtml)

    /////
    let chats = await getChatsByContacto()

    console.log(chats)

    let htmlChat = ``
    for(let c of chats) {
        let htmlMsj = ``
        if(c.hasMedia) {
            if(c.type == 'image') {
                htmlMsj = `<img src="data:image/png;base64,${c._data.body}"/>`
            } else if(c.type == 'document') {
                htmlMsj = `<p class="chat-message ${c.fromMe ? 'chat-sent' : ''}">Documento: ${c.body}<span class='chat-timestamp'>${transform(c.timestamp)}</span></p>`
            }
        } else {
            if(c.hasQuotedMsg) {
                // c._data.id.fromMe
                // c._data.quotedMsg.type
            }
            htmlMsj = `<p class="chat-message ${c.fromMe ? 'chat-sent' : ''}">${c.body}<span class='chat-timestamp'>${transform(c.timestamp)}</span></p>`
        }
        
        htmlChat += htmlMsj
    }

    $('.message-content').html(htmlChat)
}

function transform(unix_timestamp) {
    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime
}

async function getChats() {
    try {
        let r = await fetch('./chats.json')
        let chats = await r.json()
        return chats
    } catch (err) {
        console.log('Hubo un error desconocido al mandar el mensaje', err)
        return null;
    }
}

async function getChatsByContacto() {
    try {
        let r = await fetch('./chatsById.json')
        let chats = await r.json()

        return chats
    } catch (err) {
        console.log('err getChatsByContacto', err)
        return null;
    }
}

// texto
// texto con formato
// texto con links
// sticker
// gif
// video
// emojis
// audio
// imagen
// archivo
// quote texto, imagen, audio
// mensaje eliminado
// contacto
