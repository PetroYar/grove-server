import Visit from "../models/Visit.js";


const visitControler = {
  visit: async (req,res) => {
     const today = new Date().toISOString().split("T")[0]; 

     try {
       const visit = await Visit.findOneAndUpdate(
         { date: today },
         { $inc: { count: 1 } }, 
         { upsert: true, new: true } 
       );

       res.json(visit);
     } catch (error) {
       res.status(500).json({ error: "Помилка сервера" });
     }
  },
  getVisit:async (req,res) => {
     try {
       const visits = await Visit.find().sort({ date: 1 }); 
       res.json(visits);
     } catch (error) {
       res.status(500).json({ error: "Помилка сервера" });
     }
  }
}

export default visitControler