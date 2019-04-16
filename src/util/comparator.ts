export interface Comparator<E> {
     compare(e1: E, e2: E): number;
}

export function isComparator<E>(param: any): param is Comparator<E> {
     if(param === undefined || param === null){
          return false;
     }
     return (<any>param).compare !== undefined;
}
