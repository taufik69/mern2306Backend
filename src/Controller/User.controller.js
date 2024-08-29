const CreateUser = async(req,res)=> {
    try {
        res.send("EveryThing is Ok")
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {CreateUser}