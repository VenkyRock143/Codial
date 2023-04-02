module.exports.profile = function(req ,res){
    return res.render('profile',{
        title:'Profile'
    })
}
//Rendering the sign Up page
module.exports.signUp  = function(req ,res){
     res.render('user_sign_up',{
        title: "Codial|sign Up"
    })
}
//Rendering the sign In page
module.exports.signIn  = function(req ,res){
    res.render('user_sign_in',{
       title: "Codial|sign In"
   })
}

//get the sign up data
module.exports.create = function(req ,res){

}

//get the sign In data
module.exports.create_session = async function(req,res){
    const user = await User.findOne({email: req.body.email})
    //if user found
    if(user){
        console.log('hello')
    //handle if password not match
        if(user.password != req.body.password){
            return res.redirect('back');
            console.log('hi')

        }
    //if usder found create session
        res.cookie('user_id',user.id);
        return res.redirect('/user/profile')
    }
    //if user not found
    else{
        return res.redirect('back');
    }
}

module.exports.profile = function(req ,res){
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id ,function(err , user){
            if(user){
                res.render('profile',{
                    title: "User Profile",
                    user: user
                })
            }
            else{
                return res.redirect('back')
            }
        })
    }
    else{
        return res.redirect('back')
    }
}