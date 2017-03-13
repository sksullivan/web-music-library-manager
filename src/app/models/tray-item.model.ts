export class TrayItem {
	name: string;
	componentName: string;
	requiredCollectionKeys: string[];
	iconName: string;
	icon: string;

	constructor(name: string, componentName: string, requiredCollectionKeys: string[], iconSpecification: string) {
		this.name = name;
		this.componentName = componentName;
		this.requiredCollectionKeys = requiredCollectionKeys;
		if (iconSpecification.includes('fa')) {
			this.iconName = iconSpecification;
		} else {
			this.icon = iconSpecification;
		}
	}
}