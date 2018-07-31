function sendToTG (msg) {
	const request = require('request');
	
	console.log('Sending to TG: '+ msg)
	request({
		url: 'https://api.telegram.org/bot654283043:AAH2Z4q_DgMlb_NTwHhR7KG0AQGtTHB17J0/sendMessage?chat_id=-318931511&text=https://instagram.com/p/'+msg+'/',
		proxy: 'http://vladimir:testtest1@195.68.202.70:31289'
	  }, function (error, response, body) {
		if (error) {
			console.log(error);
		}// else {console.log(response);}
	  });
	
}
async function instagramPhotos () {
  console.log('Started')
  var newArr = []
  var oldArr = []
  var interval = 300000
	const axi = require('Axios')
	
  const cron = require("node-cron");

  setInterval(async function(){
    console.log('Run parsing: ' + new Date())
	newArr = []
    try {
        const userInfoSource = await axi.get('https://www.instagram.com/fcsm_official/') // vovka_zhi

        // userInfoSource.data contains the HTML from Axios
        const jsonObject = userInfoSource.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1)

        const userInfo = JSON.parse(jsonObject)
        // Retrieve only the first 10 results
        const mediaArray = userInfo.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.splice(0, 10)
        for (let media of mediaArray) {
            const node = media.node
            newArr.push(node.shortcode)
            //console.log('https://www.instagram.com/p/' + node.shortcode + '/')
        }
    } catch (e) {
        console.error('Unable to retrieve photos. Reason: ' + e.toString())
    }
    console.log('newArr length:'+newArr.length)
    //initialization
    if(oldArr.length === 0){
      oldArr = Array.from(newArr)
      for (var i = 0; i < oldArr.length; i++) {
        console.log(oldArr[i])
      }
    }
    else{
      for (var i = 0; i < newArr.length; i++) {
        if (oldArr.indexOf(newArr[i]) === -1){
          oldArr.push(newArr[i])
		  sendToTG(newArr[i])
        }
      }
    }
  }, interval);
}
//!!!newArr!!!!!!!!
instagramPhotos ();
