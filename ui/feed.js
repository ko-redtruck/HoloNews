//data construct

var data = {
  //elements of the post upload
  postBody:"",
  postTitle: "",
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
      <img v-bind:src="post.Entry.imageSrc"/>
    </div>
  `
})

var vm = new Vue({
  el: "#app",
  data: data,
  methods: {
    uploadPost: uploadPost,
    loadPosts: loadPosts,
    onFileChanged: onFileChanged
  }
})

//ipfs node setup
const node = new Ipfs({ repo: "ipfs-" + Math.random});

node.on("ready", async function () {
  //wait for the IPFS version to debug
  const version = await node.version();
  console.log("Ipfs-Version: " + version.version);
})

function uploadPost() {
  //firstly uploads all images and videos to IPFS
  //then commits the rest to the public DHT
  //configure all the data that will be commited to the DHT
  //Holochain post schema
  var postData = {
    //data.postBody == vm.postBody
    "body": data.postBody,
    "title": data.postTitle,
    "postImageHashes": []
  }

  node.files.add(new node.types.Buffer(data.postImageBuffer), async function(err, filesAdded) {
    if (err) {
      return console.error('Error - ipfs add', err, res)
    }

    await filesAdded.forEach(function (file) {
      console.log('successfully stored', file.hash)
      postData.postImageHashes.push(file.hash)
    })

    //call the post function in the zome "posting"
    request("posting","post",JSON.stringify(postData),function (result) {
      //callback
    })

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
    data.postImageBuffer = JSON.stringify(Buffer.from(reader.result));
    //convert it to base64 to display it as an image.src
    data.postImageSrc = base64ArrayBuffer(reader.result);
  }
  reader.readAsArrayBuffer(file);
}
