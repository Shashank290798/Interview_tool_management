// Technology Controller
const Technology = require("../../models/addTechnologies");

// Add Technology
exports.addTechnology = async (req, res) => {
  try {
    // trims whitespace
    const technologyName = req.body.technology_name.trim();
    const existingTechnology = await Technology.findOne({
      technology_name: { $regex: new RegExp(`^${technologyName}$`, "i") },
      isDeleted: false,
    });
    if (existingTechnology) {
      // If a technology with this name exists, and it matches the input name
      if (
        existingTechnology.technology_name.toLowerCase() ===
        technologyName.toLowerCase()
      ) {
        existingTechnology.isDeleted = false;
        await existingTechnology.save();
      }
      // Redirect to the technologies page (whether or not the technology was added)
      return res.redirect("/technologies");
    } else {
      // Technology doesn't exist, create a new one
      const technology = new Technology({ technology_name: technologyName });
      await technology.save();
      return res.redirect("/technologies");
    }
  } catch (err) {
    console.error(err);
  }
};

// Get Technology List
exports.getList = async (req, res) => {
  try {
    let role = req.role;
    const technologies = await Technology.find({ isDeleted: false });
    res.render("pages/technologies", {
      technologies: technologies,
      role: role,
    });
  } catch (error) {
    console.log(error);
    res.send("An error occurred");
  }
};

// get technology in interview form
exports.getTechnology = async (req, res) => {
  try {
    let role = req.role;
    if (role !== "superadmin") {
      return res.render("pages/401", { role: role });
    }
    const technology = await Technology.find({ isDeleted: false });
    res.render("pages/addInterviewer", { technology: technology, role: role });
  } catch (err) {
    console.error(err);
  }
};

// Edit Technology

exports.editTechnology = async (req, res) => {
  try {
    const id = req.body.id;
    const technology_name = req.body.technology_name.trim();
    const existingTechnology = await Technology.findOne({
      technology_name: { $regex: new RegExp(`^${technology_name}$`, "i") },
    });
    if (existingTechnology) {
      // If a technology with this name exists, and it matches the input name
      if (
        existingTechnology.technology_name.toLowerCase() ===
        technology_name.toLowerCase()
      ) {
        // The technology name hasn't changed, so update the existing technology
        existingTechnology.isDeleted = false;
        await Technology.findByIdAndUpdate(id, { technology_name });
      } else {
        // The technology name has changed, so check if the new name already exists
        return res.status(409).send("Technology with this name already exists");
      }
    } else {
      // The technology doesn't exist, so update it
      await Technology.findByIdAndUpdate(id, { technology_name }).exec();
    }
    res.redirect("/technologies");
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send("Technology with this name already exists");
    }
    console.error(error);
    return res
      .status(500)
      .send("An error occurred while updating the technology.");
  }
};
// Soft Delete Technology
exports.deleteTechnology = async (req, res) => {
  try {
    const technologyId = req.params.id;
    const technology = await Technology.findByIdAndUpdate(technologyId, {
      isDeleted: true,
    });
    if (!technology) {
      return res.status(404).json({ msg: "Technology not found" });
    }
    await technology.save();
    res.json({ msg: "Technology soft deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};
