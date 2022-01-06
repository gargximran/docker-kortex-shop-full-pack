module.exports = async (req, res) => {
  if(req.user){
    console.log(req.user)
    return apiResponse.success(res, {message: req?.user?.shop?.slug});
  }else{
    return apiResponse.error(res, 401, "Unauthenticated");
  }
};
