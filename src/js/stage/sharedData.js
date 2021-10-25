import * as me from 'melonjs/dist/melonjs.module.js';
import { SharedMap } from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";

class SharedData {
	constructor () {
		this.tinyliciousClient = new TinyliciousClient();
		this.containerSchema = {
			initialObjects: {
				tileLayerMap: SharedMap,
				playerDataMap: SharedMap
			}
		};
		this.dataContainer = null;
	}
	
	async start (onReady) {
		console.log("SharedData start");
		
		if (location.hash) {
			console.log("Load existing data container");
			this.id = location.hash.substring(1);
			await this.loadExistingDataContainer(this.id)
			onReady();
		}
		else {
			console.log("Create new data container");
			const id = await this.createNewDataContainer();
			location.hash = id;
			onReady();
			return id;
		}
	}
	
	async loadExistingDataContainer (id) {
		this.id = id;
		const { container } = await this.tinyliciousClient.getContainer(id, this.containerSchema);
		this.dataContainer = container;
	}
	
	async createNewDataContainer () {
		const { container } = await this.tinyliciousClient.createContainer(this.containerSchema);
		this.dataContainer = container;
		const id = await container.attach();
		this.id = id;
		this.dataContainer = container;
		return id;
	}
	
	getTileLayerMap () {
		//console.log("getTileLayerMap");
		//console.log(this.dataContainer);
		return this.dataContainer.initialObjects.tileLayerMap;
	}
	
	getPlayerDataMap () {
		return this.dataContainer.initialObjects.playerDataMap;
	}
};

export default SharedData;