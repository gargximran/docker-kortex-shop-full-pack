var apiResponse = {
    success: (res, data = {}, status_code = 200,  message = "Request process successfully") => {
        res.setHeader("Content-Type", "application/json");
        return res.status(data?.status_code ?? status_code).send({success:true, status_code:status_code, message:message, data});
    },


    error: (res, status_code = 400,  message = "Something went wrong!") => {
        res.setHeader("Content-Type", "application/json");
        return res.status(status_code).json({success:false, status_code:status_code, message:message});
    },

    errorWithData: (res, errors = null, status_code = 400,  message = "Something went wrong!") => {
        res.setHeader("Content-Type", "application/json");
        return res.status(status_code).send({success:false, status_code, message, errors});
    },

};

global.apiResponse = apiResponse;