const gmeta = require("./gmeta");
console.log("GMeta: Test!");

// Using callback

gmeta("https://github.com", function (err, data) {
  console.log("[CALLBACK] GMeta: Test from URL!", data);
});

gmeta(
  '<title>GitHub</title><meta name="description" content="GitHub is where people build software. More than 28 million people use GitHub to discover, fork, and contribute to over 85 million projects.">',
  function (err, data) {
    console.log("[CALLBACK] GMeta: Test from HTML!", data);
  },
  true
);

(async () => {
  try {
    const result = await gmeta("https://github.com");
    console.log("[PROMISE] GMeta: Test from URL!", result);
  } catch (err) {
    console.log(1, err);
  }

  try {
    const result = await gmeta(
      '<title>GitHub</title><meta name="description" content="GitHub is where people build software. More than 28 million people use GitHub to discover, fork, and contribute to over 85 million projects.">',
      true
    );
    console.log("[PROMISE] GMeta: Test from HTML!", result);
  } catch (err) {
    console.log(2, err);
  }

  try{
    const result = await gmeta("https://sports.hankooki.com/news/articleView.html?idxno=6790752");
    console.log("[PROMISE] GMeta: Test from sportshan!", result);
    console.log('----------------------');
  }catch(err){
    console.log(3, err);
  }

  try{
    const result = await gmeta("https://sports.hankooki.com/lpage/entv/202203/sp20220321142553136730.htm?s_ref=nv");
    console.log("[PROMISE] GMeta: Test http-equiv", result);
    console.log('----------------------');
  }catch(err){
    console.log(4, err);
  }

})();



