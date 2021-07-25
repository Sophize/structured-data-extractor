import { Component, Input, SimpleChanges } from '@angular/core';
import {
  PropositionPointer,
  ResourcePointer,
  ResourceType,
} from 'sophize-datamodel';

@Component({
  selector: 'app-mini-resource-display',
  templateUrl: './mini-resource-display.component.html',
  styleUrls: ['./mini-resource-display.component.scss'],
})
export class MiniResourceDisplayComponent {
  readonly ResourceType = ResourceType;
  readonly P_GET = 'get';

  @Input()
  resourceId: PropositionPointer | ResourcePointer = null;

  @Input()
  resourceType = ResourceType.UNKNOWN;

  @Input()
  isPropositionPointer = false;

  @Input()
  showIcon = true;

  @Input()
  context: ResourcePointer;

  referenceMd = '';
  expandedMd = '';

  ngOnChanges(changes: SimpleChanges) {
    let refString;
    if (this.isPropositionPointer) {
      refString = (this.resourceId as PropositionPointer).toString();
    } else {
      refString = (this.resourceId as ResourcePointer).toString();
    }
    this.referenceMd = '#(' + refString + ', NAME)';
    this.expandedMd = '#(' + refString + ', EXPAND)';
  }

  get mdContext() {
    return {
      // inline: true,
      contextPtr: this.context,
      plainText: true,
    };
  }
}
