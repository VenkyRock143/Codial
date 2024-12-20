
const User = require('../models/user');
const path = require('path');
const fs = require('fs');


module.exports.profile = async function(req, res){
    let user = await User.findById(req.params.id)
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });

}

module.exports.profilepage = async function(req, res){
    let user = await User.findById(req.params.id)
        return res.render('profilepage', {
            title: 'User Profile'
        });

}
module.exports.update = async function(req,res){
    if(req.user.id == req.params.id){
        try{       
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log("***Error In Multer***:", err);
                }
                user.name = req.body.name;
                user.email = req.body.email;
                
                if(req.file){
                    if(user.avatar){
                       if(fs.existsSync(path.join(__dirname,'..',user.avatar))){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                       }
                    }
                    user.avatar = User.avatarPath+ '\\'+ req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }
        catch(err){
            return res.redirect('back');
        }
    }
    else{
        return res.status(401).send('Unauthorized');
    }
}




// render the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = async function(req, res){
    try {
         if (req.body.password != req.body.confirm_password){
            req.flash('error','Password Unmatched!')
        return res.redirect('back');
    }
    const oldUser = await User.findOne({email: req.body.email});
    console.log(oldUser)
    if(!oldUser){
        const createdUser = await User.create(req.body)
        console.log(createdUser)
        req.flash('success','Signed In SuccessFully')
        return res.redirect('/users/sign-in')
    }
    else{
        req.flash('error','User Already Exists')
        return res.redirect('back')
    }
    } catch (error) {
        console.log('Error'.err);
        return res.redirect('back');
    }
   
}

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success','successfully logged in!')
    return res.redirect('/');
}
module.exports.homepage = function(req, res){
    return res.redirect('/');
}

module.exports.destroySession= function(req,res){
    req.logout(function(err){
        if(err){
            console.log("error")
            return;
        }
        req.session.destroy(function(err){
        if(err){
            console.log("error")
            return;
        } 
        res.clearCookie('codeial')
        return res.redirect('/') 
        // req.flash('success','Successfully Logged Out')
        });
       
    });
}