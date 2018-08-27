//data construct

var data = {
  //elements of the post upload
  postBody:"",
  postTitle: "",
  postImageHashes: [],
  //image src for displaying a preview
  postImageSrc: "",
  //data for ipfs upload
  postImageBuffer: "",
  //post array containing all uploaded posts
  posts:[]
}

Vue.component("post-feed",{
  props:{
    post: {
      type: Object,
      required: true
    }
  },
  template: `
    <div class="post-window">
      <h3>{{post.Entry.title}}</h3>
      <p>{{post.Entry.body}}</p>
      <img v-bind:src="imageSrc"  />
    </div>
  `,
  computed: {
    imageSrc : function () {
      //use the public ipfs gateway if the browser extension isn*t running
      if (window.ipfs){
        return "http://127.0.0.1:8080/ipfs/" + this.post.Entry.postImageHashes[0]
      }
      else {
        return "https://ipfs.io/ipfs/" + this.post.Entry.postImageHashes[0]
      }
    }
  }
})

function testF() {
  console.log("function executed dynamically");
  return "testF-id"
}

var vm = new Vue({
  el: "#app",
  data: data,
  methods: {
    uploadPost: uploadPost,
    loadPosts: loadPosts,
    onFileChanged: onFileChanged
  }
})

/*
//ipfs node setup for ipfs-js
const node = new Ipfs({ repo: "ipfs-" + Math.random});

node.on("ready", async function () {
  //wait for the IPFS version to debug
  const version = await node.version();
  console.log("Ipfs-Version: " + version.version);
})
*/


if (window.ipfs) {
  console.log("window.ipfs is active")
  const node = window.ipfs;
  console.log("set node to window.ipfs")
  console.log(node)
} else {
    // Fallback
    console.log("no ipfs browser plugin found")
}




function getImageSrc(hash,componentInstance) {
  //this === vue component instance
  console.log(hash)
  console.log(componentInstance)

  node.cat(hash, function (err, file,componentInstance) {
    if (err) {
      throw err
    }
    else {
      console.log(file.toString('utf8'))

      var arrayBufferView = new Uint8Array( file );
      var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
      var reader = new FileReader();
      reader.onloadend = function(componentInstance) {
        var base64data = reader.result;
        console.log(base64data);
        console.log(typeof base64data);
        this.imageSrc= "base64data";
      }
      reader.readAsDataURL(blob);

      /*
      var urlCreator = window.URL || window.webkitURL;
      console.log(urlCreator.createObjectURL( blob ))
      var ObjectURL =  urlCreator.createObjectURL( blob )

      var img = document.createElement("img");
      img.src = ObjectURL
      img.onload = function() {
        urlCreator.revokeObjectURL(this.src);
      }
      document.querySelector(".post-window").append(img);
      console.log(img)
      */
    }
  })

  /*
  node.cat(this.post.Entry.postImageHashes[0]).then((stream) => {
      var buf = [];
      var blob;
      stream.on('data', (file) => {
        var data = Array.prototype.slice.call(file);
        buf = buf.concat(data);
      });
      stream.on('end', (file) => {
        if (typeof blob !== 'undefined') {
          window.URL.revokeObjectURL(blob);
        }

        buf = new Buffer(buf);
        blob = new Blob([buf], { type: 'image/jpg' });
        console.log(blob)
        console.log(window.URL.createObjectURL(blob))
        return window.URL.createObjectURL(blob);
      });
    });
    */
}

function uploadPost() {
  //firstly uploads all images and videos to IPFS
  //then commits the rest to the public DHT
  //configure all the data that will be commited to the DHT
  //Holochain post schema
  var postData = {
    //data.postBody == vm.postBody
    "body": data.postBody,
    "title": data.postTitle,
    "postImageHashes": data.postImageHashes
  }
  /*
  node.add(data.postImageBuffer, async function(err, filesAdded) {
    if (err) {
      return console.error('Error - ipfs add', err)
    }

    await filesAdded.forEach(function (file) {
      console.log('successfully stored', file.hash)
      postData.postImageHashes.push(file.hash)
    })
    */
    //call the post function in the zome "posting"
    request("posting","post",JSON.stringify(postData),function (result) {
      //callback
    })
}


function loadPosts() {
  request("posting","getPostsTemp","",function (posts) {
    vm.posts= JSON.parse(posts);
  })
}

function onFileChanged(event) {
  return createBuffer(event.target.files[0])
}



//creates/ reads image src from file
function createBuffer(file) {
  var reader = new FileReader();
  var enc = new TextEncoder(); // always utf-8
  var dec = new TextDecoder("utf-8");

  reader.onloadend = function () {
    //convert it to a buffer for ipfs to upload
    window.ipfs.add(Buffer.from(reader.result), async function(err, filesAdded) {
      if (err) {
        return console.error('Error - ipfs add', err)
      }

      await filesAdded.forEach(function (file) {
        console.log('successfully stored', file.hash)
        data.postImageHashes.push(file.hash)
      })
    })
    //convert it to base64 to display it as an image.src
    data.postImageSrc = base64ArrayBuffer(reader.result);
  }
  reader.readAsArrayBuffer(file);
}
