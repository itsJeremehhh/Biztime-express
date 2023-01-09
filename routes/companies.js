// routes for companies

const express = require("express");
const slugify = require("slugify"); //what is this library? were we supposed to know it?
const ExpressError = require("../expressError");//"../" indicates to go back(or up) a folder to find the library
const db = require("../db");

let router = new express.Router(); //need to ask about the new keyword and its role in this code

//get a list of companies
router.get("/", async (req, res, next) => {
    try{
        const result = await db.query(
            `SELECT code, name
            FROM companies
            ORDER BY name`
        );
        return res.json({"companies": result.rows});
    } 
    catch (err) {
        return next(err);
     }
});

//get company details
router.get("/:code", async (req, res, next) => {
    try {
        let code = req.params.code;

        const compResult = await db.query(
            `SELECT code, name, description
            FROM companies
            WHERE code = $1`, [code]
        );
    // get companie invoice
        const invResult = await db.query (
            `SELECT id
            FROM invoices
            WHERE comp_code = $1`, [code]
        );
    // throw an error handler
        if (compResult.row.length === 0) {
            throw new ExpressError(`no such company: ${code}`, 404)
        }
        const company = compResult.rows[0];
        const invoices = invResult.rows;

        company.invoices = invoices.map(inv => inv.id); //review map function and this arrow syntax

        return res.json({"company": company});
    }

    catch(err){
        return next(err);
    }
});

// add new company
router.post("/", async (req, res, next) => {
    try {
        let {name, description} = req.body; //destructuring on a post request?
        let code = slugify(name, {lower: true}); //from further study otherwise req.body.code?

        const result = await db.query(
            `INSERT INTO companies (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description`, 
            [code, name, description]);
        return res.status(201).json({"company": result.rows[0]});
    }
    catch (err) {
        return next(err);
    }
});

//update a company. need to ask if this would be PATCH instead
router.put("/:code", async (res, req, next) => {
    try {
        let {name, description} = req.body; //how do we know when to use destructoring here?
        let code = req.params.code;

        const result = await db.query(
            `UPDATE companies
            SET name=$1, description=$2
            WHERE code = $3
            RETURNING code, name, descriptnion`,
            [name, description, code]);
            
        if (result.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404)
        } else {
            return res.json({"company": result.rows[0]});
        }
    }
    catch (err){
        return next(err);
    }
});

//deleting companies

router.delete("/:code", async (res, req, next) => {
    try {
        let code = req.params.code;

        const result = await db.query(
            `DELETE FROM companies
            WHERE code=$1
            RETURNING code`,
            [code]);
        if (result.rows.length == 0){
        throw new ExpressError(`No such company: ${code}`, 404)
        } else {
            return res.json({"status": "deleted"});
        }
    }
    catch (err){
        return next(err);
    }
});

module.exports = router;
//this module.exports allows these functions to be used in other js files via require syntax