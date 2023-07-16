import React, { useEffect, useState } from "react";
import LinkedList from "./linkedList";
import { DEFAULT_UISTATE, UiState } from "./types/uiState";
import { ControlPanel } from "./controlPanel";
import "./css/drawingMotion.css";
import { BackendLinkedList, BackendLinkedListNode, EdgeEntity, EntityConcrete, EntityType, FrontendLinkedListGraph, NodeEntity } from "./types/graphState";


export const DrawingMotions: React.FC<BackendLinkedList> = (state) => {
  const [settings, setSettings] = useState<UiState>(DEFAULT_UISTATE);
  /**
   * Parse the background graph state into frontend ones
   */
  const parseState = (state: BackendLinkedList): FrontendLinkedListGraph => {
    const nodeEntities: NodeEntity[] = [];
    const edgeEntities: EdgeEntity[] = [];
    const cacheEntity: {
      [uid: string]: EntityConcrete
    } = {};
  
    // Create a mapping for the backend nodes
    const nodeMapping: { [key: string]: BackendLinkedListNode } = {};
    state.nodes.forEach((node) => {
      nodeMapping[node.nodeId] = node;
    });
  
    // Now we build the NodeEntities and EdgeEntities
    state.nodes.forEach((node, index) => {
      // Convert backend node to frontend node
      const nodeEntity: NodeEntity = {
        uid: node.nodeId,
        type: EntityType.NODE,
        title: node.value ? node.value.toString() : '',
        colorHex: '#FFFFFF', // default color
        size: 50, // default size
        edges: [], // will be filled in the next step
        x: index * 100, // simple positioning
        y: 100, // simple positioning
      };
      nodeEntities.push(nodeEntity);
  
      // If there's a next node, create an edge between the current node and the next node
      if (node.next) {
        const nextNode = nodeMapping[node.next];
        if (nextNode) {
          const edgeEntity: EdgeEntity = {
            uid: `${node.nodeId}-${nextNode.nodeId}`, 
            type: EntityType.EDGE,
            from: nodeEntity,
            to: nodeEntities.find(n => n.uid === nextNode.nodeId)!, // It's sure to find because we've already created all the nodes
            label: '', // you might need a better way to label the edge
            colorHex: '#FFFFFF', // default color
          };
          edgeEntities.push(edgeEntity);
  
          // Attach this edge to the node
          nodeEntity.edges.push(edgeEntity);
        }
      }
    });

    [...nodeEntities, ...edgeEntities].forEach((entity) => {
      cacheEntity[entity.uid] = entity;
    });

    const frontendState: FrontendLinkedListGraph = {
      nodes: nodeEntities,
      edges: edgeEntities,
      cacheEntity,
      head: nodeEntities[0],
    }

    return frontendState;
  };

  const initialFrontendState = parseState(state);
  const [currGraphState, setCurrGraphState] = useState<FrontendLinkedListGraph>(initialFrontendState);
  const [histroyGraphState, setHistoryGraphState] = useState<FrontendLinkedListGraph[]>([initialFrontendState]);
  useEffect(() => {
    const newFrontendState = parseState(state);

    setCurrGraphState(newFrontendState);
    setHistoryGraphState([...histroyGraphState, newFrontendState]);
  }, [state]);

  /**
   * Hard code for now yea yea
   */

  return (
    <div>
      <div className="container">
        <div className="control-panel">
          <ControlPanel settings={settings} setSettings={setSettings} />
        </div>
        <div className="linked-list">
          <LinkedList settings={settings} linkedListState={currGraphState} />
        </div>
      </div>
    </div>
  );
};