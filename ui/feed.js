//data construct
var data = {
  postBody:"",
  posts:[]
}

Vue.component("post-feed",{
  props:{
    post: {
      type: Object,
      required: true
    }
  },
  template: "<h3>{{post.Entry.body}}</h3>"
})

var vm = new Vue({
  el: "#app",
  data: data,
  methods: {
    uploadPost: uploadPost,
    loadPosts: loadPosts
  }
})

function uploadPost() {
  //post schema
  var postData = {
    "body": data.postBody
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
