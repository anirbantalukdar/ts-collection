import { AbstractCollection } from "./abstractcollection";
import { Set } from "./set";
import { Collection } from "./collection";
import { Objects } from "./objects";

export abstract class AbstractSet<E> extends AbstractCollection<E> implements Set<E> {
     protected constructor(){
          super();
     }

     public removeAll(c: Collection<E>){
          Objects.requireNonNull(c);
          let modified = false;
          if(this.size() > c.size()){
               for(let i = c.iterator(); i.hasNext(); ){
                    modified = modified || this.remove(i.next());
               }
          }else {
               for(let i = this.iterator(); i.hasNext(); ){
                    if(c.contains(i.next())){
                         i.remove();
                         modified = true;
                    }
               }
          }
          return modified;
     }
}