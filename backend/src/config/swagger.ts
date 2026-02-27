import swaggerJsdoc, { Options } from "swagger-jsdoc";

const options: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Support Desk API",
            version: "1.0.0",
            description: "API documentation for Support Desk system",
        },
        servers: [
            {
                url: "http://localhost:3333",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
        paths: {
            "/auth/login": {
                post: {
                    tags: ["Auth"],
                    summary: "Login user",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        email: { type: "string" },
                                        password: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: "Successful login" },
                        400: { description: "Invalid credentials" },
                    },
                },
            },

            "/auth/register": {
                post: {
                    tags: ["Auth"],
                    summary: "Register new user (ADMIN only)",
                    security: [{ BearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string" },
                                        email: { type: "string" },
                                        password: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: { description: "User created" },
                    },
                },
            },

            "/tickets": {
                post: {
                    tags: ["Tickets"],
                    summary: "Create ticket",
                    security: [{ BearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        title: { type: "string" },
                                        description: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: { description: "Ticket created" },
                    },
                },
                get: {
                    tags: ["Tickets"],
                    summary: "List tickets",
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        {
                            in: "query",
                            name: "status",
                            schema: {
                                type: "string",
                                enum: ["OPEN", "IN_PROGRESS", "CLOSED"],
                            },
                        },
                    ],
                    responses: {
                        200: { description: "List of tickets" },
                    },
                },
            },

            "/tickets/{id}/status": {
                patch: {
                    tags: ["Tickets"],
                    summary: "Update ticket status (AGENT, ADMIN)",
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        {
                            in: "path",
                            name: "id",
                            required: true,
                            schema: { type: "string" },
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        status: {
                                            type: "string",
                                            enum: ["OPEN", "IN_PROGRESS", "CLOSED"],
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: "Status updated" },
                    },
                },
            },

            "/comments/{ticketId}": {
                post: {
                    tags: ["Comments"],
                    summary: "Create comment",
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        {
                            in: "path",
                            name: "ticketId",
                            required: true,
                            schema: { type: "string" },
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        content: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: { description: "Comment created" },
                    },
                },
                get: {
                    tags: ["Comments"],
                    summary: "List comments of a ticket",
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        {
                            in: "path",
                            name: "ticketId",
                            required: true,
                            schema: { type: "string" },
                        },
                    ],
                    responses: {
                        200: { description: "List of comments" },
                    },
                },
            },
        },
    },
    apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);