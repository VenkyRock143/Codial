const User = require('../models/user');

module.exports.profile = function(req ,res){
    return res.render('profile',{
        title:'Profile'
    })
}
//Rendering the sign Up page
module.exports.signUp  = function(req ,res){
     return res.render('user_sign_up',{
        title: "Codial|sign Up"
    })
}
//Rendering the sign In page
module.exports.signIn  = function(req ,res){
    return res.render('user_sign_in',{
       title: "Codial|sign In"
   })
}

//get the sign up data
module.exports.create = async function(req ,res){
    if(req.body.password != req.body.confirm_password){
    return res.redirect('back');
    }
    const newUser = await User.findOne({email: req.body.email})
    console.log(newUser)
    if(!newUser){
        const createdUser = await User.create(req.body)
        console.log(createdUser)
        return res.redirect('/user/sign-in')
    }
    else{
        return res.redirect('back')
    }
    // User.findOne({email: req.body.email},function(err,user){
    //     if(err){
    //         console.log('error in singning up');
    //         return
    //     }
    //     if(!user){
    //         User.create(req.body,function(err,user){
    //             if(err){
    //                 console.log('error in singning up');
    //                 return
    //             }
    //             return res.redirect('/user/sign_in')
    //         })
    //     }
    //     else{
    //        return  res.redirect('back');
    //     }

}

//get the sign In data
module.exports.create_session = async function(req,res){
   //find the user
git 

}