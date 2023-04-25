const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = async function(req, res){
    try{
       let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        if(req.xhr){
            //  if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            await post.populate('user');
            return res.status(200).json({
                data:{
                    post:post
                },
                message:"Post Created!"
            });
        }

        req.flash('success','Post Created')
        return res.redirect('back');

    }catch(err){
        req.flash('Error', err);
         // added this to view the error on console as well
         console.log(err);
        return res.redirect('back')
    }
  
}

    module.exports.destroy = async function(req, res){

        try{
            let post = await Post.findById(req.params.id);
    
            if (post.user == req.user.id){
                
                //delete associated likes for post as well for comments too
                await Like.deleteMany({likeable: post, onModel: 'Post'});
                await Like.deleteMany({_id: {$in: post.comments}});

                post.deleteOne();
    
                await Comment.deleteMany({post: req.params.id});
                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            post_id:req.params.id
                        },
                        message:"Post Deleted"
                    });
                }

                req.flash('success','Post Deleted')
                return res.redirect('back');
            }else{
                req.flash('error','Unable to delete Post')
                return res.redirect('back');
            }
    
        }catch(err){
            req.flash('Error', err);
            return res.redirect('back')
        }
        
    }