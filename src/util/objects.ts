import { Comparable } from "./comparable";
import { NullPointerException } from "../lang/nullpointerexception";

export class Objects {
     public static equals(o1: Object, o2: Object): boolean {
          if(o1 === null){
               return o2 === null;
          }else {
               let oc1 = <any>o1;
               return oc1.equals(o2);
          }
     }

     public static requireNonNull<T>(obj: T): T {
          if(obj === null){
               throw new NullPointerException();
          }
          return obj;
     }
}