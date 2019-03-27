const studnets = [{
    id: 1,
    name: "A00966488"
}, {
    id: 2,
    name: "A09876543"
}];

const grades = [
    {id: 1,
    gradeID: 1,
    grade: 100},
    {id: 2,
    gradeID: 2,
    grade: 80}
];

const getstudent = (id) => {
    return new Promise((resolve, reject) => {
        const student = studnets.find((student) =>{
        return student.id === id;
    });
    if (student) {
        resolve(student)
    }else {
        reject(`Unable to find student with id of ${id}`);
    }
    });
};

const getGrades = (id) => {
    return new Promise((resolve, reject) => {
        resolve(grades.filter((grade) => grade.id === id))
    });
};

const getStatus = async id => {
    // throw new Error("Wrong user");
    // return "Shravan";
    const student = await getstudent(id);
    const grades = await getGrades(id);

    let average = 0.0;
    if (grades.length > 0) {
        average = grades.map((grade) => grade.grade)
            .reduce((running_total, current_num) => running_total + current_num)/ grades.length

    }
    return `${student.name} has an average of ${average}%`;
};

getStatus(3).then((name) => {
    console.log(name)
}).catch((err) => {
    console.log(err)
});

// const getStatus = id => {
//     return getstudent(id).then((user) => {
//         return getGrades(user.id)
//     }).then((grades) =>{
//
//     })
// };

// getStatus(2).then((status) => {
//     console.log(status)
// }).catch((err) => {
//     console.log(err)
// });
// getGrades(1).then((result) => {
//     console.log(result)
// }).catch((error) =>{
//     console.log(error)
// });
//
// getstudent(2).then((result) => {
//     console.log(result)
// }).catch((err) => {
//     console.log(err)
// });