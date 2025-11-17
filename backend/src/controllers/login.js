// controllers/login.js

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { client } from "../db/db.js"; // your PostgreSQL or MongoDB client
import dotenv from "dotenv";

dotenv.config();


export const loginUser = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const email = req.body.email ? req.body.email.trim() : null;
const password = req.body.password ? req.body.password : null;
    console.log(email, password);
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    if(!result){console.log("faltu error here")}
    const user = result.rows[0];
    console.log(user)

    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    
    const validPassword = await bcrypt.compare(password, user.password);
    if (password !== user.password)
      return res.status(401).json({ message: "Invalid email or password" });

    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      success: true,  
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
