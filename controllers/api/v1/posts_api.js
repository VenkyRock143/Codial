const Post = require('../../../models/post')
const Comment = require('../../../models/comment')

module.exports.index = async function(req,res){

    let posts = await Post.find({})
   .sort('-createdAt')
   .populate('user')
   .populate({
       path: 'comments',
       populate: {
           path: 'user'
       }
   });
    return res.json(200, {
        message: "List Of Posts",
        posts:posts
    })
}

module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

      if(post.user == req.user.id ){

     
            post.deleteOne();

            await Comment.deleteMany({post: req.params.id});

        
            return res.json(200, {
                message:"Post associated with its comments is deleted"
            });
         }else{
            return res.json(401, {
                message:"Unathorized User!"
            });
         }

    }catch(err){
        console.log("error",err);
        return res.json(500, {
            message:"something went wrong in your code"
        });
    }
    
}