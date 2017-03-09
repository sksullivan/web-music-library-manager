export class TrayItem {
	name: string;
	iconName: string;
	componentName: string;

	constructor(name: string, iconName: string, componentName: string) {
		this.name = name;
		this.iconName = iconName;
		this.componentName = componentName;
	}
}