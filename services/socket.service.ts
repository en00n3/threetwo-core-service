"use strict";
import {
	Service,
	ServiceBroker,
	ServiceSchema
} from "moleculer";
const redisAdapter = require("socket.io-redis");
const SocketIOService = require("moleculer-io");

export default class SocketService extends Service {
	// @ts-ignore
	public constructor(
		public broker: ServiceBroker,
		schema: ServiceSchema<{}> = { name: "socket" }
	) {
		super(broker);
		this.parseServiceSchema(
			Service.mergeSchemas(
				{
					name: "socket",
					mixins: [SocketIOService],
					settings: {
						port: process.env.PORT || 3001,
						io: {
							namespaces: {
								"/": {
									events: {
										call: {
											// whitelist: ["math.*", "say.*", "accounts.*", "rooms.*", "io.*"],
										},
										action: async (data, ack) => {
											// write your handler function here.
											console.log(
												JSON.stringify(data, null, 2)
											);

											switch (data.type) {
												case "LS_IMPORT":
													console.log(
														`Recieved ${data.type} event.`
													);
													// 1. Send task to queue
													await this.broker.call(
														"library.newImport",
														data.data,
														{}
													);
													break;
												case "LS_TOGGLE_IMPORT_QUEUE":
													await this.broker.call(
														"importqueue.toggleImportQueue",
														data.data,
														{}
													);
													break;

											}
										}
									},
								},
							},
							options: {
								adapter: redisAdapter({ host: 'localhost', port: 6379 }),
							},
						},
					},
					hooks: {},
					actions: {},
					methods: {},
					async started() {
						this.io.on("connection", (data) => console.log("socket.io server initialized."))
					}
				},
				schema
			)
		);
	}
}
