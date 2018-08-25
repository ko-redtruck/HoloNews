// Functions: Validation ---------------------------
function genesis() {
  return true
}

function validateCommit() {
  return true
}

function validatePut() {
  return true
}

// validates before updating a post(hash)
function validateMod() {
  return true;
}

// validation before deletion
function validateDel() {
  return true;
}

function validateLink() {
  return true;
}

// Functions ---------------------------

function post(postData) {
  //all user post with their real idenity therefore the post should be linked to their name and not a hash
  var authorName = App.Agent.Hash;
  //commit post to the public DHT
  //all the text should be stored on the DHT
  //pictures and videos will be stored on IPFS/(Filecoin) --> only links are stored in Holochain
  var postHash = commit("post",postData);
  //commit the link between the author and the post
  var post_authorLinkHash = commit("post_links",{
    Links: [
      {Base:authorName, Link: postHash, Tag: "post"}
    ]
  });

  return postHash;
}

//temporary function
function getPostsTemp() {
  var linkEntries = getLinks(App.Agent.Hash,"post");
  var posts = new Array();
  var key = 0;
  linkEntries.forEach(function (linkEntry) {
    posts.push({"Hash":linkEntry.Hash,"Key":key,"Entry":get(linkEntry.Hash)});
    key += 1;
  });
  // do some sorting
  return JSON.stringify(posts);
}
