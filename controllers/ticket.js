import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.model.js";

export const createTicket = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({
                error: "Title and description are required",
            });
        }
        const ticket = new Ticket({
            title,
            description,
            createdBy: req.user._id.toString(),
        });
        await ticket.save();
        await inngest.send({
            name: "ticket/created",
            data: {
                ticketId: (await ticket)._id.toString(),
                title,
                description,
                createdBy: req.user._id.toString(),
            },
        });

        console.log("📨 Event sent: ticket/created");

        return res.status(201).json({
            message: "Ticket created successfully",
            ticket: ticket,
        });
    } catch (error) {
        console.error("Error creating ticket:", error);
        return res.status(500).json({
            error: "Error creating ticket",
            message: error.message,
        });
    }
};

export const getTickets = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }
        let tickets = [];
        if (user.role !== "user") {
            tickets = await Ticket.find({})
                .populate("assignedTo", ["email", "_id"])
                .sort({ createdAt: -1 });
        } else {
            tickets = await Ticket.find({ createdBy: user._id })
                .select("title description status createdAt")
                .sort({ createdAt: -1 });
        }
        return res.status(200).json({
            message: "Tickets fetched successfully",
            tickets: tickets,
        });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return res.status(500).json({
            error: "Error fetching tickets",
            message: error.message,
        });
    }
};

export const getTicket = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }
        let ticket;
        if (user.role !== "user") {
            ticket = await Ticket.findById(req.params.id).populate(
                "assignedTo",
                ["email", "_id"]
            );
        } else {
            ticket = await Ticket.findOne({
                createdBy: user._id,
                _id: req.params.id,
            }).select("title description status createdAt");
        }
        if (!ticket) {
            return res.status(404).json({
                error: "Ticket not found",
            });
        }
        return res.status(200).json({
            message: "Ticket fetched successfully",
            ticket: ticket,
        });
    } catch (error) {
        console.error("Error fetching ticket:", error);
        return res.status(500).json({
            error: "Error fetching single ticket",
            message: error.message,
        });
    }
};
