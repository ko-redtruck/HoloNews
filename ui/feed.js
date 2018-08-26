//data construct

var data = {
  //elements of the post upload
  postBody:"",
  postTitle: "",
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

function uploadPost() {
  //post schema
  var postData = {
    //data.postBody == vm.postBody
    "body": data.postBody,
    "title": data.postTitle,
    "imageSrc": data.postImageSrc
  }

  //call the post function in the zome "posting"
  request("posting","post",JSON.stringify(postData),function (result) {
  })
}

function loadPosts() {
  request("posting","getPostsTemp","",function (posts) {
    vm.posts= JSON.parse(posts);
  })
}

function onFileChanged(event) {
  return createImage(event.target.files[0])
}



//creates/ reads image src from file
function createImage(file) {
  var reader = new FileReader();

  reader.onloadend = function () {
    data.postImageSrc =  reader.result;
  }
  reader.readAsDataURL(file);
}

const node = new Ipfs({ repo: 'ipfs-' + Math.random() })
    node.once('ready', () => {
      console.log('Online status: ', node.isOnline() ? 'online' : 'offline')
      // You can write more code here to use it. Use methods like
      // node.files.add, node.files.get. See the API docs here:
      // https://github.com/ipfs/interface-ipfs-core
    })
