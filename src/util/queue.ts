import { Collection } from "./collection";

export interface Queue<E> extends Collection<E> {
     enqueue(e: E): boolean;
     offer(e: E): boolean;

     
     dequeue(): E;
     poll(): E;

     /**
      * Retrieves but does not remove head of the queue.
      * This method throws an exception if the queue is empty.
      */
     element(): E;

     /**
      * Retrieves but does not remove the head of the queue. This method 
      * does not throws an exception if the quere is empty, returns null.
      */
     peek(): E;
}