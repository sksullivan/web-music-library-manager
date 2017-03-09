export class TrayItem {
	name: string;
	componentName: string;
	iconName: string;
	icon: string;

	constructor(name: string, componentName: string, iconSpecification: string) {
		this.name = name;
		this.componentName = componentName;
		if (iconSpecification.includes('fa')) {
			this.iconName = iconSpecification;
		} else {
			this.icon = iconSpecification;
		}
	}
}