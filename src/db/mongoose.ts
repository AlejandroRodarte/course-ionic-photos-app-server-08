import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URL ? process.env.MONGODB_URL : '', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    
    if (err) {
        throw err;
    }

    console.log(`Base de datos online en ${process.env.MONGODB_URL}`);

});
