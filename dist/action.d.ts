import { ActionSchema } from "moleculer";
export interface ActionOptions {
    name?: ActionSchema["name"];
    cache?: ActionSchema["cache"];
    metrics?: ActionSchema["metrics"];
    params?: ActionSchema["params"];
}
export declare function action(options?: ActionOptions): MethodDecorator;
