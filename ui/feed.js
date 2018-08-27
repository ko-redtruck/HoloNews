//data construct

var data = {
  //elements of the post upload
  postBody:"",
  postTitle: "",
  postImageHashes: [],
  //image src for displaying a preview
  postImageSrc: "",
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
      <div v-html="post.Entry.body"></div>
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

// vue setup
var vm = new Vue({
  el: "#app",
  data: data,
  methods: {
    uploadPost: uploadPost,
    loadPosts: loadPosts,
    onFileChanged: onFileChanged
  },
  computed: {
    converter: function () {
      return new showdown.Converter();
    },
    markDownHTML : function () {
      return this.converter.makeHtml(data.postBody);
    }
  }
})

// ipfs setup
if (window.ipfs) {
  console.log("window.ipfs is active")
  const node = window.ipfs;
  console.log("set node to window.ipfs")
  console.log(node)
} else {
    // Fallback
    console.log("no ipfs browser plugin found")
}


function uploadPost() {
  console.log(this.markDownHTML)
  console.log(this.markDownHTML.valueOf())
  //firstly uploads all images and videos to IPFS
  //then commits the rest to the public DHT
  //configure all the data that will be commited to the DHT
  //Holochain post schema
  var postData = {
    //data.postBody == vm.postBody
    "body": this.markDownHTML,
    "title": data.postTitle,
    "postImageHashes": data.postImageHashes
  }
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
  return uploadToIpfs(event.target.files[0])
}

function uploadToIpfs(file) {
  var reader = new FileReader();

  reader.onloadend = function () {
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
