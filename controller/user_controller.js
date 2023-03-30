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
module.exports.create_session = function(req,res){

}