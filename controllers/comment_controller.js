const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like')

module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user','email');

            let job = queue.create('emails',comment).save(function(err){
                if(err){
                    console.log('Error in sending the queue',err);
                    return;
                }
                console.log('job enqueued',job.id);
            });
            // commentsMailer.newComment(comment);
            if(req.xhr){
                  // Similar for comments to fetch the user's id!
                // await comment.populate('user');
                
            
                return res.status(200).json({
                    data:{
                        comment:comment
                    },
                    message:"Post Created!"
                });
            }

            
            req.flash('success','Comment Published')
            res.redirect('/');
        }
    }catch(err){
        req.flash('error',err)
        return res.redirect('back')
    }
    
}


module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.deleteOne();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
              //delete associated likes of the comments
              await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

              // send the comment id which was deleted back to the views
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment_id:req.params.id
                    },
                    message:"comment Deleted"
                });
            }

            req.flash('success','Post and Associated comment destroyed')
            return res.redirect('back');
        }else{
            req.flash('error','Cannot delete this comment')
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error',err)
        return res.redirect('back')
    }
    
}