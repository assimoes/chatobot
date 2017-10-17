Init = (mongoose) => {
   
    const UserSchema = mongoose.model('User', {
        name: String,
        github: String,
        address: Object
    });

    return {
        UserSchema: UserSchema
    }
}

module.exports.Init = Init;
