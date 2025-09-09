import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from "@angular/core";
import { ToastComponent } from "../components/toast/toast.component";



@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(
    private appRef: ApplicationRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  show(type: 'success' | 'error' | 'warning' | 'info', title: string, description: string) {
    const factory = this.resolver.resolveComponentFactory(ToastComponent);
    const componentRef = factory.create(this.injector);

    componentRef.instance.type = type;
    componentRef.instance.title = title;
    componentRef.instance.description = description;

    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    setTimeout(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }, 5000);
  }
}