const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    }

}, { timestamps: true });


// Hachage du mot de passe avant sauvegarde
userSchema.pre('save', async function () {

    if (!this.isModified('password')) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);

});


// Méthode pour comparer le mot de passe
userSchema.methods.comparePassword = async function (candidatePassword) {

    return await bcrypt.compare(
        candidatePassword,
        this.password
    );

};

module.exports = mongoose.model("User", userSchema);