const express = require("express")
const bodyparse = require("body-parser")
PORT=3000
const mongoose = require("mongoose")
const app = express();

app.use(bodyparse.urlencoded({
    extended: true
}));

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/courseDB", {useNewUrlParser: true});

// creting schema 
const courseSchema ={
    id:Number,
    courseName:String,
    courseType:String,
    courseDuration:String,
    courseRating:Number
};

// creating model 
const Course = mongoose.model("Course",courseSchema);

// chained route handlers 
app.route("/courses")
    .get(function(req,res){
        Course.find({},function(err,foundCourses){
            if(!err){
                res.send(foundCourses)
            } else{
                res.send(err)
            }
        })
    })
    .post(function(req,res){
        const newCourse = new Course({
        id:parseInt(req.body.id),
        courseName:req.body.courseName,
        courseType:req.body.courseType,
        courseDuration:req.body.courseDuration,
        courseRating:parseInt(req.body.courseRating)
        });

        // saving newLy added data to mongoDB 
        newCourse.save(function(err){
            if(!err){
                res.send("Successfully added a new courseSchema.");
            } else{
                res.send(err);
            }
        })

    })
    .delete(function(req,res){
        Course.deleteMany(function(err){
            if(!err){
                res.send("Successfully deleted all courses.")
            } else{
                res.send(err)
            }
        })
    });


// for getting particular courses details 
app.route("/courses/:courseDetails")

    // for getting course details of particular id 
    .get(function(req,res){
        Course.findOne({id:req.params.courseDetails},function(err,foundCourse){
            if(foundCourse && !err){
                res.send(foundCourse)
            } else {
                res.send("No data found with given id")
            }
        });

    })

    // update all data for particular course id 
    .put(function(req,res){
        Course.updateMany(
            {id: parseInt(req.params.courseDetails)},            
            {id: parseInt(req.body.id), courseName: req.body.courseName, courseType: req.body.courseType, courseDuration: req.body.courseDuration, courseRating:parseInt(req.body.courseRating)},
            function(err){
                if(!err){
                    res.send(" Successfully update all fields.");
                }
            }
        );
    });
    

app.listen(PORT,function(){
    console.log("Server started on port 3000")
});


